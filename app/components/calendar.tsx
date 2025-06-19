import useAppContext from "../context/appContext";

function Calendar() {
  const { startDate, setStartDate } = useAppContext();

  const changeStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      setStartDate(new Date(newDate).toISOString().split('T')[0]); // Format to ISO string and slice to match input value
    } else {
      setStartDate(new Date().toISOString().split('T')[0]); // Reset to current date if input is empty
    }
  }

  return (
    <input
      type="date"
      className="w-full justify-start text-left font-normal p-2 rounded-md bg-slate-600 border border-slate-500 hover:bg-slate-500"
      id="meeting-time"
      name="meeting-time"
      value={startDate ? startDate.slice(0, 16) : ""}
      onChange={(e) => changeStartDate(e)} //Format timezone -3 GMT
    />

  );
}
Calendar.displayName = "Calendar";

export { Calendar };