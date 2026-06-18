export const dateToString = (inputDate: Date | string) => {
    const date = new Date(inputDate);

    const formatted = date.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric"
    });
    return formatted;
}

