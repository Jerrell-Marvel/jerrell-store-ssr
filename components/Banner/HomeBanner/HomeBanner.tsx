import Image from "next/image";
type HomeBannerProps = {
  src: string;
  heading?: string;
};
function HomeBanner({ src, heading }: HomeBannerProps) {
  return (
    <div className="relative after:absolute after:left-0 after:right-0 after:top-0 after:bottom-0 after:bg-black after:opacity-40 after:content-['']">
      <Image src={src} alt="temporary alt" layout="responsive" width="2" height="1" />
      <p className="absolute bottom-1/4 left-4 z-[2] text-2xl font-bold uppercase text-white sm:text-4xl md:left-8 md:text-6xl lg:left-12 lg:text-8xl">{heading}</p>
    </div>
  );
}

export default HomeBanner;
