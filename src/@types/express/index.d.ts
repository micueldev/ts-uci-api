import User from "../../Domain/Model/User/User";

declare global{
    namespace Express {
        interface Request {
            currentUser: User
        }
    }
}