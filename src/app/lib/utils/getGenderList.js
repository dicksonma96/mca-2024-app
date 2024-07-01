export default function (data, gender) {
  if (gender == "m") return data?.filter((item) => item.title == "Mr");

  if (gender == "f")
    return data?.filter((item) => item.title == "Ms" || item.title == "Mdm");

  return data;
}
