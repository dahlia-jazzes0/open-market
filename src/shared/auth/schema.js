import sb from "@/shared/schema/schema-builder";

export const loginUsernameSchema = sb.string({ message: "필수 정보입니다." }).trim().min(1, "필수 정보입니다.");
export const loginPasswordSchema = sb.string({ message: "필수 정보입니다." }).trim().min(1, "필수 정보입니다.");
