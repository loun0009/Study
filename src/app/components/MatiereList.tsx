"use client";

import Link from "next/link";
import { motion } from "motion/react";

type Matiere = {
  id: number;
  name: string;
};

export default function MatiereList({ matieres }: { matieres: Matiere[] }) {
  return (
    <ul className="space-y-3">
      {matieres.map((matiere, index) => (
        <motion.li
          key={matiere.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <Link href={`/matieres/${matiere.id}`}>
            <motion.div
              whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
              className="block rounded-lg border border-gray-200 p-4"
            >
              {matiere.name}
            </motion.div>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}