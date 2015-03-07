window.onload = main

function initCanvas(canvas, ctx)
{
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    var img = new Image();
    img.src = '/images/bg.jpg'
    img.onload = function ()
    {
        var bg = ctx.createPattern(img, 'repeat');
        ctx.fillStyle = bg;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.globalAlpha = 1;

        var paddingW = canvas.width/10;
        var paddingH = canvas.height/10;
        var boardW = canvas.width-paddingW*2;
        var boardH = canvas.height-paddingH*2;
        var cellW = boardW/3;
        var cellH = boardH/3;

        var refDimension = canvas.width < canvas.height ? canvas.width : canvas.height;
        ctx.lineWidth = refDimension * 1/100;
        ctx.lineCap = 'round';

        for(i=1; i<=2; ++i)
        {
            var lineGrad = ctx.createLinearGradient(cellW*i + paddingW, paddingH, cellW*i + paddingW, boardH+paddingH);
            lineGrad.addColorStop(0, '#2F3D73'); // dark blue
            lineGrad.addColorStop(1, '#4768EA'); // light blue

            ctx.beginPath();
            ctx.moveTo(cellW*i + paddingW, paddingH);
            ctx.lineTo(cellW*i + paddingW, boardH+paddingH);

            ctx.strokeStyle = lineGrad;
            ctx.stroke();

            lineGrad = ctx.createLinearGradient(paddingW, cellH*i + paddingH, boardW+paddingW, cellH*i + paddingH);
            lineGrad.addColorStop(0, '#2F3D73'); // dark blue
            lineGrad.addColorStop(1, '#4768EA'); // light blue

            ctx.beginPath();
            ctx.moveTo(paddingW, cellH*i + paddingH);
            ctx.lineTo(boardW+paddingW, cellH*i + paddingH);
            ctx.strokeStyle = lineGrad;
            ctx.stroke();
        }
    }
}

function main()
{
    var canvas = document.getElementById('board');

    if(canvas.getContext)
    {
        ctx = canvas.getContext('2d');
        initCanvas(canvas, ctx);
    }
    else
    {
        console.log("Canvas is not supported!");
    }
}
