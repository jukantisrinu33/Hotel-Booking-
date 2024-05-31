//async Error Handler function
const aysncWrap=function(fun)
{
    return function(req,res,next)
    {
        fun(req,res,next).catch((err)=>{next(err);})
    }
}

module.exports=aysncWrap;