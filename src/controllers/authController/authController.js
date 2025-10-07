import bcrypt from "bcryptjs";
import User from "../../models/userModel.js";
import { generateToken } from "../../utils/tokenHelper.js";
import { translations } from "../../translations/translations.js";
import { createResponseMessageClass } from "../../utils/responseHelper.js";

export const signUp = async (req, res) => {
    try {
        const { username, password, firstName, lastName, phone } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json(createResponseMessageClass(null, true, translations.usernameAlreadyExists));

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            phone
        });
        await user.save();

        const token = generateToken(user);
        res.status(201).json(createResponseMessageClass(null, false, translations.userRegisteredSuccessfully));
    } catch (error) {
        console.error(error);
        res.status(500).json(createResponseMessageClass(null, true, translations.signUpFailed));
    }
};

export const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user)
            return res.status(200).json(
                createResponseMessageClass(null, true, translations.userNotFound)
            );

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect)
            return res.status(401).json(
                createResponseMessageClass(null, true, translations.invalidCredentials)
            );

        const token = generateToken(user);
        const userFullName = `${user.firstName} ${user.lastName}`;

        res.json(
            createResponseMessageClass(
                { token, userFullName },
                false,
                translations.loginSuccessful
            )
        );
    } catch (error) {
        console.error(error);
        res.status(500).json(
            createResponseMessageClass(null, true, translations.signInFailed)
        );
    }
};

