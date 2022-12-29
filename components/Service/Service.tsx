import { motion } from "framer-motion";
const services = [
  {
    service: "Original Guaranteed",
    description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat, error? lorem",
  },
  {
    service: "Free shipping",
    description: "Lorem ipsum dolor sit,  elit. Placeat, error?",
  },
  {
    service: "Easy Payment",
    description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat, error?",
  },
  {
    service: "Easy Return",
    description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat, error?",
  },
];

const listVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const containerVariants = {
  hidden: {
    // opacity: 0,
    // x: "-100%",
  },
  visible: {
    // opacity: 1,
    // x: 0,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function Service() {
  return (
    <>
      <section id="service" className="mx-auto px-6 py-12 md:py-20">
        <motion.ul className="flex flex-wrap justify-around gap-y-12 lg:gap-y-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {services.map((service, index) => {
            return (
              <motion.li className="align flex w-full flex-col items-center text-center md:w-[45%] lg:w-[20%]" key={index} variants={listVariants}>
                <div className="mb-4 text-5xl">👻</div>
                <h3 className="text-2xl font-medium">{service.service}</h3>
                <p>{service.description}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>
    </>
  );
}

export default Service;
