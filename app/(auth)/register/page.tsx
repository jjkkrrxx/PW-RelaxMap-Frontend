import { Suspense } from "react";
import AuthNav from "@/components/AuthNav/AuthNav";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";
import styles from "./register.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.content}>
      <AuthNav />
      {/* форма читає ?from= через useSearchParams — потрібен Suspense */}
      <Suspense fallback={null}>
        <RegistrationForm />
      </Suspense>
    </div>
  );
}
