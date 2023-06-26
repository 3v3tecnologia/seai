export const previewEmailCensured = (email: string) => {
  const startCharHidden = 5;
  const endCharHidden = email.length - 4;

  const startEmail = email.slice(0, startCharHidden);
  const midEmailHide = email
    .slice(startCharHidden, endCharHidden)
    .split("")
    .map(() => "*")
    .join("");
  const endEmail = email.slice(endCharHidden, email.length);

  return `${startEmail}${midEmailHide}${endEmail}`;
};
