import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
import collab from '../assets/collab.jpg';
import realtime from '../assets/realtime.jpg';
import secure from '../assets/secure.jpg';
import manage from '../assets/manage.jpg';

const content = [
  {
    title: "Seamless Team Collaboration",
    description:
      "Effortlessly Manage and Share Resources Create teams, organize resources, and store important documents all in one place. TeamShareNetwork makes collaboration easy with intuitive file management tools and secure sharing features, empowering teams to work more efficiently and stay organized.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        <img
          src={collab}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Real-Time Communication",
    description:
      "Chat and Video Calls Made Easy Stay connected with your team through integrated chat and video call features. Whether you're discussing a project or brainstorming ideas, TeamShareNetwork ensures real-time communication with high-quality video and instant messaging.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src={realtime}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Secure File Sharing & Storage",
    description:
      "Keep Your Data Safe and Accessible Upload, store, and share documents with confidence. With TeamShareNetwork, your files are encrypted, and access permissions are fully customizable, ensuring secure sharing and management of sensitive team resources.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        <img
          src={secure}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Customizable Team Management",
    description:
      "Tailored to Your Team's Needs Whether you're working on a college project or a professional task, TeamShareNetwork lets you customize your team structure, roles, and permissions. Efficiently manage access to resources and ensure that everyone is on the same page with organized workflows.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        <img
          src={manage}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
];

export default function StickyScrollRevealDemo() {
  return (
    <div>
      <StickyScroll content={content} />
    </div>
  );
}
