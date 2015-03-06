window.onload = function ()
{
    var canvas = document.getElementById('board'),
        ctx = canvas.getContext('2d');

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}
