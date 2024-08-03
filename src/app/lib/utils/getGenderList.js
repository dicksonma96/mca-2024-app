export default function (data, gender) {
  if (gender == "m")
    return data?.filter((item) => item.title == "Mr" || item.title == "Dr_M");

  if (gender == "f")
    return data?.filter(
      (item) =>
        item.title == "Ms" || item.title == "Mdm" || item.title == "Dr_F"
    );

  return data;
}
