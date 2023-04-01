import { loadavg } from "os";
import React, { memo } from "react";
import { Button } from "react-bootstrap";

interface ButtonProps {
  variant?: string;
  text: string;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "lg";
  className?: string;
  onClick?: () => void;
  loading?: boolean;
}

export default memo(function CustomButton(props: ButtonProps) {
  let { text, loading = false, ...otherprops } = props;

  return (
    <Button {...otherprops} className="customButton">
      {loading ? (
        <div className="spinner-border" role="status">
          {/* <span className="sr-only">Loading...</span> */}
        </div>
      ) : (
        text
      )}
    </Button>
  );
});
