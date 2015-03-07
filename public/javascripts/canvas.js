window.onload = main

function Board(canvas)
{
    this.canvas = canvas;

    this.paddingW = null;
    this.paddingH = null;
    this.boardW = null;
    this.boardH = null;
    this.cellW = null;
    this.cellH = null;
}

Board.prototype.isBoardClick = function(x, y)
{
    if(x >= this.paddingW && y >= this.paddingH && x <= this.boardW && y <= this.boardH)
    {
        return true;
    }

    return false;
};

Board.prototype.canvasClicked = function(event)
{
    var x = event.clientX;
    var y = event.clientY;
    console.log("X: " + x +" Y: " + y);

    if(this.isBoardClick(x, y))
    {
        console.log("In board!");
    }
};

Board.prototype.drawBoard = function (img)
{
    var ctx = this.canvas.getContext('2d'),
        bg = ctx.createPattern(img, 'repeat');

    ctx.fillStyle = bg;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.globalAlpha = 1;

    var refDimension = this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height;
    ctx.lineWidth = refDimension * 1/100; // 1% of the smallest dimension
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
};

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
};

function main()
{
    var canvas = document.getElementById('board');

    if(canvas.getContext)
    {
        var b = new Board(canvas);
        b.init();
    }
    else
    {
        console.log("Canvas is not supported!");
    }
}
