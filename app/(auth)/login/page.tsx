import { Suspense } from "react";
import AuthNav from "@/components/AuthNav/AuthNav";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.content}>
      <AuthNav />
      <h1 className={styles.formTitle}>Вхід</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
