import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-40">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="rounded-full h-12 w-12 border-t-4 border-yellow-400 border-solid border-b-4 border-white"
      />
    </div>
  );
}
