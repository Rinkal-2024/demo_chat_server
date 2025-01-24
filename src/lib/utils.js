import jwt from 'jsonwebtoken';
export const generateToken = (userId , res) => {
    const token = jwt.sign({userId} , process.env.JWT_SECRET , {
        expiresIn: '7d'
    });

    res.cookie('jwt' , token , {
        // prevent XSS attack by not allowing the cookie to be accessed by client side javascript.
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true , 
        sameSite : 'Strict', // CSRF attack prevention by allowing the cookie to be sent only to the same site.
        secure : process.env.NODE_ENV === 'production',
    })
}