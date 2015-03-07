function X(ctx, w, h)
{
    Shape.call(this, ctx);
    this.w = w;
    this.h = h;
}

X.prototype = Object.create(Shape.prototype);
X.prototype.constructor = X;

X.prototype.draw = function(x, y)
{
    console.log("X.draw > x: " + x + " y: " + y + " w: " + this.w + " h:" + this.h);

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + this.w, y + this.h);

    this.ctx.moveTo(x + this.w, y);
    this.ctx.lineTo(x, y + this.h);

    this.ctx.stroke();
}
