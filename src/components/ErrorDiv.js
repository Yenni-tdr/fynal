export const ErrorDiv = ({ children, condition }) => {
    if(condition === 'true') {
        return(
            <div className="text-red-600 font-bold md:text-right">{children}</div>
        )
    }
    else return null;
}