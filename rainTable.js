export function rainTable(id, type) {
  if (type == "Drizzle") {
    if (id < 310) {
      return 300;
    } else if (id > 312) {
      return 1500;
    } else {
      return 700;
    }
  }
  if (type == "Rain") {
    if (id < 504) {
      return 300;
    } else if (id > 520) {
      return 1500;
    } else {
      return 700;
    }
  }
}
