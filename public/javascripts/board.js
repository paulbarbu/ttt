function Board(canvas, game)
{
    this.canvas = canvas;
    this.game = game;

    this.paddingW = null;
    this.paddingH = null;
    this.boardW = null;
    this.boardH = null;
    this.cellW = null;
    this.cellH = null;
    this.refDimension = 0;
}

Board.prototype.isBoardClick = function(x, y)
{
    if(x >= this.paddingW && y >= this.paddingH && x <= this.boardW && y <= this.boardH)
    {
        return true;
    }

    return false;
}

//x, y, relative to the board origin
Board.prototype.coordToCell = function(x, y)
{
    var row, col;

    for(i=1; i<=3; ++i)
    {
        if((i-1)*this.cellW <= x && x <= i*this.cellW)
        {
            col = i;
        }

        if((i-1)*this.cellH <= y && y <= i*this.cellH)
        {
            row = i;
        }
    }

    return [row-1, col-1];
}

Board.prototype.canvasClicked = function(event)
{
    var x = event.clientX;
    var y = event.clientY;
    console.log("X: " + x +" Y: " + y);

    if(this.isBoardClick(x, y))
    {
        var boardX = x-this.paddingW,
            boardY = y-this.paddingH;
        console.log("Board: X: " + boardX +" Y: " + boardY);

        var rc = this.coordToCell(boardX, boardY);
        var row = rc[0],
            col = rc[1];
        console.log("Row: " + row + " Col: " + col);

        if(this.game.isValid(row, col))
        {
            var ctx = this.canvas.getContext('2d');
            ctx.save();
            ctx.translate(col*this.cellW + this.paddingW, row*this.cellH + this.paddingH);
            ctx.lineWidth = this.refDimension * 1/100; // 1% of the smallest dimension

            if(Math.round(Math.random()))
            {
                var x = new X(ctx, this.cellW - (this.cellW/10)*2, this.cellH - (this.cellH/10)*2);
                x.draw(this.cellW/10, this.cellH/10);

            }
            else
            {
                var o = new O(ctx, this.cellW - (this.cellW/10)*2, this.cellH - (this.cellH/10)*2);
                o.draw(this.cellW/10, this.cellH/10);
            }

            ctx.restore();

            this.game.set(row, col);
        }
        else
        {
            console.log("Invalid position!");
        }
    }
}

Board.prototype.drawBoard = function (img)
{
    var ctx = this.canvas.getContext('2d'),
        bg = ctx.createPattern(img, 'repeat');

    ctx.save();
    ctx.fillStyle = bg;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();

    ctx.save();
    this.refDimension = this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height;
    ctx.lineWidth = this.refDimension * 1/100; // 1% of the smallest dimension
    ctx.lineCap = 'round';

    for(i=1; i<=2; ++i)
    {
        // vertical lines

        ctx.save();
        ctx.translate(this.cellW*i + this.paddingW, this.paddingH);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.boardH);

        var lineGrad = ctx.createLinearGradient(0, 0, 0, this.boardH);
        lineGrad.addColorStop(0, '#2F3D73'); // dark blue
        lineGrad.addColorStop(1, '#4768EA'); // light blue

        ctx.strokeStyle = lineGrad;
        ctx.stroke();
        ctx.restore();

        // horizontal lines

        ctx.save();
        ctx.translate(this.paddingW, this.cellH*i + this.paddingH);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.boardW, 0);

        lineGrad = ctx.createLinearGradient(0, 0, this.boardW, 0);
        lineGrad.addColorStop(0, '#2F3D73'); // dark blue
        lineGrad.addColorStop(1, '#4768EA'); // light blue

        ctx.strokeStyle = lineGrad;
        ctx.stroke();
        ctx.restore();
    }
    ctx.restore();
}

Board.prototype.init = function()
{
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;

    this.paddingW = this.canvas.width/10;
    this.paddingH = this.canvas.height/10;
    this.boardW = this.canvas.width-this.paddingW*2;
    this.boardH = this.canvas.height-this.paddingH*2;
    this.cellW = this.boardW/3;
    this.cellH = this.boardH/3;

    var img = new Image();
    img.src = '/images/bg.jpg';
    img.onload = function() {
        this.drawBoard(img);
        this.canvas.addEventListener('click', this.canvasClicked.bind(this));
    }.bind(this);
}