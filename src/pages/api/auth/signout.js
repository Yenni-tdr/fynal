import { getSession, signOut } from "next-auth/react";

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    await signOut({ redirect: false, req });

    res.status(200).json({ message: "Signed out successfully" });
};

export default handler;