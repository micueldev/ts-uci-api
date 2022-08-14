import DateFormatter from "../DateFormatter";
import User from "../../../Domain/Model/User/User";


export interface PostUserProps {
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string
}

export interface PutUserProps {
    username: string,
    first_name: string,
    last_name: string,
    email: string
}

interface DefaultUserOutputProps {
    id: number|null,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    created_at: string|null,
    updated_at: string|null,
}

class UserTransformer
{
    public static postBodyToUser(body: PostUserProps): User
    {
        let user = new User();
        user.username = body.username
        user.firstName = body.first_name;
        user.lastName = body.last_name;
        user.email = body.email;
        user.setPassword(body.password);

        return user;
    }

    public static putBodyToUser(body: PutUserProps): User
    {
        let user = new User();
        user.username = body.username
        user.firstName = body.first_name;
        user.lastName = body.last_name;
        user.email = body.email;

        return user;
    }

    public static userToDefaultOutput(user: User): DefaultUserOutputProps
    {
        return {
            id: user.id,
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            created_at: DateFormatter.format(user.createdAt),
            updated_at: DateFormatter.format(user.updatedAt)
        }
    }
}


export default UserTransformer;
