import ListItem from "./(reusable)/ListItem";

export default function Footer() {
  const d = new Date();

  const year = d.getFullYear();
  return (
    <footer className="flex flex-col h-full w-full p-4 bg-[#011e17] ">
      <p className="flex w-full items-center justify-center mb-5 p-2 text-center border-b-2">
        At Routine Works we focus on installing a healthy routine of applying
        for available positions everyday.
      </p>
      <div className="text-center columns-1 gap-4 sm:columns-3 sm:gap-8 mb-5">
        <ul>
          <ListItem title="We find available vacancies and send it to you" />
          <ListItem
            title="All job listings provided by"
            linkUrl="http://www.adzuna.co.za"
            imgLink="https://zunastatic-abf.kxcdn.com/assets/images/press/adzuna_logo/adzuna_logo.jpg"
            altTitle="Adzuna logo"
          />
          <ListItem
            title="Developed by SJ Pencils"
            linkUrl="https://github.com/Pencils0101001101001010"
          />
        </ul>
      </div>
      <p className="flex w-full items-center justify-center">
        © {year} RoutineWorks
      </p>
    </footer>
  );
}
