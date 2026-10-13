export type PackageFormFields = {
  title: string; badge: string; sessions: string; price: string; oldPrice: string;
  savings: string; popular: boolean; benefits: string[];
};
// An editor record carries its id, but the route id is not an editable field.
export function packageFormFields(initial: PackageFormFields & { id?: string }): PackageFormFields {
  return { title: initial.title, badge: initial.badge, sessions: initial.sessions, price: initial.price, oldPrice: initial.oldPrice, savings: initial.savings, popular: initial.popular, benefits: [...initial.benefits] };
}
