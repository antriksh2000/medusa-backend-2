import { defineWidgetConfig } from "@medusajs/admin-sdk";
import DrawerComponent from "../components/drawer";
import SignUpForm from "../components/sign-up";


const SignupWidget = () => {
  return (
    <div>
      <p className="text-center mt-4">
        No business account?{" "}
        <DrawerComponent title="Sign Up" content={<SignUpForm />} />
      </p>
    </div>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "login.after",
});

export default SignupWidget;