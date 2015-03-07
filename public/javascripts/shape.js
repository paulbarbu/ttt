function Shape(ctx)
{
    if(this.constructor === Shape)
    {
        throw 'Shape is an abstract class, cannot instantiate it';
    }

    this.ctx = ctx;
}

Shape.prototype.draw = function(x, y)
{
    throw 'Shape.draw is not implemented';
}
