export function toTitleCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function IsBoolean(val) {
  val = val.toLowerCase().trim();
  if (val === 'yes') val = true;
  else if (val === 'no') val = false;
  else val = 'err';
  return val;
}

export function formSource(source) {
  let client_domain = source.split('.')[0];
  if (client_domain === 'client') {
    source = source.replace('client.', 'accenture.vendor.');
  } else source = source.replace(client_domain, `${client_domain}.vendor`);
  return source;
}
