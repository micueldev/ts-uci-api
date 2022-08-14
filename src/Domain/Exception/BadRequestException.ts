
class BadRequestException extends Error
{
    private readonly STATUS = 400;

    public constructor (message: string) {
        super();
        this.message = message;
    }

    public getStatus(): number
    {
        return this.STATUS;
    }

    public getMessage(): string
    {
        return this.message;
    }
}


export default BadRequestException;
