import { useEffect } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({
  style,
  text = "Submit",
  pending = "Submitting",
  setLoading,
}) {
  const status = useFormStatus();

  useEffect(() => {
    if (setLoading) setLoading(status.pending);
  }, [status.pending]);

  return (
    <button className="cta_btn" style={style} disabled={status.pending}>
      {status.pending ? `${pending}...` : text}
    </button>
  );
}

export default SubmitButton;
