import { isLoggedIn } from "../utils/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn()) {
            router.push("/login");
        }
    }, []);

    return <>{children}</>;
}
