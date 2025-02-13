import React from "react";
import styles from "./loader.module.css";

const Loader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loader;
