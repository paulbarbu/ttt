function O(ctx, w, h)
{
    Shape.call(this, ctx);

    this.w = w;
    this.h = h;
    this.r = w<h ? w/2 : h/2;
}

O.prototype = Object.create(Shape.prototype);
O.prototype.constructor = O;

O.prototype.draw = function(x, y)
{
    console.log("O.draw > x: " + x + " y: " + y + " w: " + this.w + " h:" + this.h);
    this.ctx.beginPath();
    this.ctx.arc((this.w+x)/2, (this.h+y)/2, this.r, 2*Math.PI, false);

    this.ctx.stroke();
}