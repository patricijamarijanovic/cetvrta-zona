import { useNavigate } from "react-router-dom";

const motivation = () => {
  const navigate = useNavigate();

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <>
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 -mt-[30px]">
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              Volontiraj s nama!
            </h1>
            <p className="text-xl text-white/90">
              Nove avanture te čekaju! Prijavi se na aktivnost i pomozi kome je potrebno!
            </p>
          </div>

          <div className="flex justify-center md:justify-end -mt-[30px]">
            <img
              src="/images/sticker1.png"
              alt="Volunteer helping the old lady"
              width={400}
              height={400}
              className="max-w-[80%]"
            />
          </div>
        </div>
        
        <div className="flex justify-center -mt-[30px]">
        <button 
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          className="hover:opacity-80 transition-opacity duration-300 bg-transparent border-none p-0"
          aria-label="Scroll down"
        >
          <img
            src="/images/down-arrow.png"
            alt="Scroll down"
            width={50}
            height={50}
          />
        </button>
        </div>
      </section>

    </>
  );
};

export default motivation;
