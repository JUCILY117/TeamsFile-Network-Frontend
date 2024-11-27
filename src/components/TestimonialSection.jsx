import { AnimatedTestimonials } from "./ui/animated-testimonials";

export default function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "\"They let me pick. Did I ever tell you that? Choose whichever Spartan I wanted. You know me. I did my research. Watched as you became the soldier we needed you to be.\"                                                                                                                                                -Cortana",
      name: "Aniket M",
      designation: "The \"Demon\"",
      src: "https://wallpapers-clan.com/wp-content/uploads/2023/11/halo-master-chief-clouds-desktop-wallpaper-preview.jpg",
    },
    {
      quote:
        "Watashi no na wa \"Kira yoshikage\" nenrei 33-sai jitaku wa moriōchō hokutō-bu no bessō chitai ni ari..kekkon wa shite inai..",
      name: "Akshit Sharma",
      designation: "*click*",
      src: "https://i.pinimg.com/564x/46/4a/ec/464aecd85fd32e8df4a68c538b7c9ff4.jpg",
    },
    {
      quote:
        "The most lore accurate Anmol description.                               *HEHE*                               *HEHE*                               *HEHE*                               *HEHE*                               *HEHE*                               *HEHE*                               *HEHE*                               *HEHE*                               *HEHE*",
      name: "Anmol Pandhi",
      designation: "The Protagonist",
      src: "https://grapeejapan.com/wp-content/uploads/47419_06.jpg",
    },
    {
      quote:
        "The best I can do is around 2 ChatGPT searches. Sorry man gotta keep up those carbs.",
      name: "Aniket Sinha",
      designation: "\"The 007\"",
      src: "https://i.ibb.co/GcsGQq0/Whats-App-Image-2024-11-27-at-13-42-21-08246c3e.jpg",
    },
  ];
  
  return <AnimatedTestimonials testimonials={testimonials} />;
}