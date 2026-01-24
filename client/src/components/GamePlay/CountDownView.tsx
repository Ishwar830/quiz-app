import { useCountdownInfo } from "@/stores/GameStore";

export default function CountDownView() {
  const countdownInfo = useCountdownInfo();
  return <div>Starting question : {countdownInfo?.endsAt}</div>;
}
