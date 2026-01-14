import React, { useRef, useState, useEffect } from 'react';
import { Github, Folder, Code2, ExternalLink } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { projectsData } from '../data/mock';
import { ScrollReveal } from './CloudInfraBackground';
import { useSmoothScroll } from './SmoothScroll';

// 3D Tilt Project Card
const ProjectCard3D = ({ project }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlowPosition({ x: 50, y: 50 });
  };

  const getProjectColor = (color) => {
    const colors = {
      red: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.2)' },
      cyan: { primary: '#00d4ff', glow: 'rgba(0, 212, 255, 0.2)' },
      amber: { primary: '#ffb800', glow: 'rgba(255, 184, 0, 0.2)' },
      green: { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.2)' }
    };
    return colors[color] || colors.cyan;
  };

  const colorScheme = getProjectColor(project.color);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group relative bg-[#12121a]/60 backdrop-blur-xl rounded-2xl overflow-hidden flex-shrink-0 w-[85vw] lg:w-[450px] h-[300px] lg:h-[350px] border border-white/10 transition-all duration-300"
      style={{
        transform,
        transformStyle: 'preserve-3d',
        borderColor: `${colorScheme.primary}20`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic glow effect following cursor */}
      <div
        className="absolute inset-0 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${colorScheme.primary}15 0%, transparent 60%)`,
        }}
      />

      {/* Background Icon Watermark */}
      <div
        className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-all duration-700"
        style={{
          transform: 'translateZ(10px) rotate(-15deg)',
        }}
      >
        <Code2 size={180} style={{ color: colorScheme.primary }} />
      </div>

      {/* Content with 3D depth */}
      <div className="relative p-6 lg:p-8 flex flex-col h-full" style={{ transform: 'translateZ(30px)' }}>

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-2xl"
            style={{
              backgroundColor: `${colorScheme.primary}15`,
              border: `1px solid ${colorScheme.primary}30`,
              boxShadow: `0 0 20px ${colorScheme.glow}`,
            }}
          >
            <Folder size={20} className="lg:size-24" style={{ color: colorScheme.primary }} />
          </div>
        </div>

        {/* Project Info */}
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 tracking-tight group-hover:gradient-text-cyan transition-all duration-300">
            {project.title}
          </h3>
          <p className="text-[#a0a0b0] text-xs lg:text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="font-mono text-[8px] lg:text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-[#6b6b7b] border border-white/5 transition-all duration-300 group-hover:border-[#00d4ff]/20 group-hover:text-[#00d4ff] group-hover:bg-[#00d4ff]/5"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Left accent line */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(180deg, transparent, ${colorScheme.primary}, transparent)`
        }}
      />
    </motion.div>
  );
};

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.scrollWidth - window.innerWidth);
    }

    // Recalculate on resize
    const handleResize = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth - window.innerWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -trackWidth]);
  const springX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section ref={sectionRef} id="projects" className="relative h-[350vh] z-20 overflow-visible">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

        {/* Section Header */}
        <div className="absolute top-12 lg:top-16 left-0 w-full text-center z-30 pointer-events-none">
          <ScrollReveal direction="down">
            <div className="inline-flex items-center gap-2 bg-[#12121a]/80 backdrop-blur-sm border border-[#00d4ff]/20 rounded-full px-4 py-2 mb-4 lg:mb-6">
              <span className="font-mono text-[9px] lg:text-[10px] text-[#00d4ff] tracking-[0.2em] uppercase">Engineering Showcase</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight px-4">
              Cloud <span className="gradient-text-amber">Infrastructure</span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Horizontal Track */}
        <motion.div
          ref={trackRef}
          style={{ x: springX }}
          className="flex gap-10 lg:gap-20 px-[10vw] lg:px-[15vw] items-center will-change-transform pt-16 lg:pt-20"
        >
          {/* Discovery Message */}
          <div className="w-[60vw] lg:w-[30vw] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-white/40 text-xl lg:text-3xl font-light leading-relaxed font-mono"
            >
              /EXPLORE <br />
              <span className="text-white/80">SYSTEMS_</span> <br />
              <span className="text-[#ffb800]">ARCHITECTURE</span>
              <div className="mt-6 lg:mt-8 w-12 lg:w-20 h-[1px] bg-gradient-to-r from-[#ffb800] to-transparent" />
            </motion.div>
          </div>

          {projectsData.map((project) => (
            <ProjectCard3D key={project.id} project={project} />
          ))}

          {/* Final Call to Action */}
          <div className="flex-shrink-0 w-[85vw] lg:w-[400px] h-[300px] lg:h-[350px] flex items-center justify-center pr-[10vw]">
            <motion.a
              href="https://github.com/chanduvardhan007"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="group w-full h-full flex flex-col items-center justify-center gap-6 p-8 rounded-2xl border border-white/5 bg-[#12121a]/40 backdrop-blur-xl transition-all duration-700 cursor-pointer"
            >
              <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:bg-[#00d4ff]/20">
                <Github size={24} className="text-white/30 group-hover:text-[#00d4ff] transition-colors" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-[#00d4ff]/10 rounded-full blur-xl"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg lg:text-xl font-bold text-white/80 mb-1 tracking-tight group-hover:text-white transition-colors">Core Repository</h3>
                <p className="text-[#a0a0b0] font-mono text-[8px] lg:text-[10px] opacity-40 group-hover:opacity-80 transition-opacity">20+ specialized deployments</p>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
