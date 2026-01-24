'use client';

import { useState, useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { Button } from '@/components/ui/button';

interface MediaAbout {
  overview: string;
  conclusion: string;
}

interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

const festivalMediaContent: MediaContentCollection = {
  video: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba8b6996?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop',
    title: 'RESONANCE 26',
    date: 'February 27-28, 2025',
    scrollToExpand: 'Scroll to Experience the Magic',
    about: {
      overview: 'Welcome to RESONANCE 26 - Two days of incredible cultural celebration featuring music, dance, fun activities, and cultural showcases. Experience the energy and excitement of our annual festival.',
      conclusion: 'Join us for an unforgettable journey through traditional and western performances, creative competitions, and amazing cultural experiences. RESONANCE 26 is where memories are made.',
    },
  },
  image: {
    src: 'https://images.unsplash.com/photo-1492684226793-913ca6068638?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1514528740917-0f7fce34942da?q=80&w=1920&auto=format&fit=crop',
    title: 'Cultural Celebration',
    date: 'Two Days of Joy',
    scrollToExpand: 'Scroll to Explore More',
    about: {
      overview: 'Experience the vibrant atmosphere of RESONANCE 26 through stunning visuals and immersive design. Our festival brings together students from across the region for a celebration of culture and creativity.',
      conclusion: 'From traditional performances to modern showcases, RESONANCE 26 offers something for everyone. Join us in creating memories that will last a lifetime.',
    },
  },
};

const MediaContent = ({ mediaType }: { mediaType: 'video' | 'image' }) => {
  const currentMedia = festivalMediaContent[mediaType];

  return (
    <div className='max-w-4xl mx-auto px-4'>
      <h2 className='text-3xl font-bold mb-6 text-white'>
        About RESONANCE 26
      </h2>
      <p className='text-lg mb-4 text-white/90 leading-relaxed'>
        {currentMedia.about.overview}
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='glass-card p-6 rounded-xl'>
          <h3 className='text-xl font-bold mb-3 text-primary'>Event Highlights</h3>
          <ul className='space-y-2 text-white/80'>
            <li>• Traditional Day Performances</li>
            <li>• Western Day Showcases</li>
            <li>• Cultural Activities</li>
            <li>• Live Music & DJ</li>
          </ul>
        </div>
        <div className='glass-card p-6 rounded-xl'>
          <h3 className='text-xl font-bold mb-3 text-primary'>Festival Info</h3>
          <ul className='space-y-2 text-white/80'>
            <li>• February 27-28, 2025</li>
            <li>• Central University Campus</li>
            <li>• 6+ Exciting Events</li>
            <li>• 1K+ Expected Attendees</li>
          </ul>
        </div>
      </div>

      <p className='text-lg text-white/90 leading-relaxed mb-8'>
        {currentMedia.about.conclusion}
      </p>

      <div className='flex justify-center'>
        <Button size="xl" className="bg-primary hover:bg-primary/90">
          Register Now
        </Button>
      </div>
    </div>
  );
};

export const ScrollExpansionDemo = () => {
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const currentMedia = festivalMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mediaType]);

  return (
    <div className='min-h-screen bg-background'>
      <div className='fixed top-4 right-4 z-50 flex gap-2'>
        <button
          onClick={() => setMediaType('video')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mediaType === 'video'
              ? 'bg-primary text-primary-foreground'
              : 'bg-black/50 text-white border border-white/30 hover:bg-black/70'
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setMediaType('image')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mediaType === 'image'
              ? 'bg-primary text-primary-foreground'
              : 'bg-black/50 text-white border border-white/30 hover:bg-black/70'
          }`}
        >
          Image
        </button>
      </div>

      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={mediaType === 'video' ? currentMedia.poster : undefined}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export default ScrollExpansionDemo;
