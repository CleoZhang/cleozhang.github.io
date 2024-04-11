export namespace Labelled {
	/* 
	Atomic label types. These are the building blocks, and at least one must be provided for a component to be labelled
	in an accessible way.
	*/

	/** An identifier that must be unique within the HTML document. */
	export type Id = { id: string };
	/** A string that labels an interactive element. */
	export type AriaLabel = { ariaLabel: string };
	/** A unique identifier of a label element (or elements) that labels this interactive element. */
	export type AriaLabelledBy = { ariaLabelledBy: string };

	// Composite types

	/**
	 * This is the union of the label atoms.
	 * It behaves similarly to an OR operator in that it is not exclusive (because there is no discriminating key).
	 * Therefore you can pass 1 to N atoms in a Labelled.Union object, but not {}.
	 * Note that `keyof Union = never`. If you want to access the keys, use {@link Intersection}.
	 */
	export type Union = Id | AriaLabel | AriaLabelledBy;
	/**
	 * This is the partial intersection of all the atoms. This means that each atom is `string | undefined`.
	 * Because of the restrictions on the type of {@link Union}, this will never be {} - at least one atom will be a
	 * string.
	 * You can safely cast {@link Union} to {@link Intersection}, or use the helper function {@link toIntersection}.
	 */
	export type Intersection = Partial<Id & AriaLabel & AriaLabelledBy>;

	/**
	 * These are the raw HTML attributes that raw interactable elements can actually accept.
	 * The union type should be translated to this before being passed to a raw element. {@see toRawAttributes}.
	 */
	export type RawAttributes = { id?: string; 'aria-label'?: string; 'aria-labelledby'?: string };

	/**
	 * Objects of type {@link Union} do not allow you to access their properties because there is no shared index of the
	 * type. If you want to get individual atomic label types, each one will be string | undefined. The type definition of
	 * {@link Union} guarantees that at least one of the keys will be a string (never 5x undefined).
	 */
	export function toIntersection(union: Union): Intersection {
		return union as Intersection;
	}

	/** Use this to translate react friendly camelcase labelled-objects to HTML friendly kebab-case objects. */
	export function toRawAttributes(union: Union): RawAttributes {
		const rawAttributes: RawAttributes = {};
		const intersection = toIntersection(union);

		rawAttributes['id'] = intersection.id;
		rawAttributes['aria-label'] = intersection.ariaLabel;
		rawAttributes['aria-labelledby'] = intersection.ariaLabelledBy;

		return rawAttributes;
	}
}