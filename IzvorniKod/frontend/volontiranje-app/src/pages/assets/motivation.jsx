const motivation = () => {
   return (
     <>
       <section className="container mx-auto px-4 py-12 md:py-24">
         <div className="grid md:grid-cols-2 gap-8 items-center">
           <div className="space-y-6">
             <h1 className="text-5xl md:text-7xl font-bold text-white">
               Volontiraj s nama!
             </h1>
             <p className="text-xl text-white/90">
               Kreni u nove avanture i pritom učini dobro djelo - klikom na jedan
               gumb!
             </p>
             <button class="bg-yellow-300 text-black text-2xl py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400">
               Uključi se!
             </button>
           </div>
           <div className="flex justify-center md:justify-end">
             <img
               src="/images/sticker1.png"
               alt="Volunteer helping the old lady"
               width={400}
               height={400}
               className="max-w-[80%]"
             />
           </div>
         </div>
       </section>
     </>
   );
 };
 
 export default motivation;
 