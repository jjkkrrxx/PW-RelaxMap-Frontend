import AuthNav from "@/components/AuthNav/AuthNav";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";
import styles from "./register.module.css";

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.authWrapper}>
          <AuthNav />
          <RegistrationForm />
        </div>
      </div>
    </main>
  );
}