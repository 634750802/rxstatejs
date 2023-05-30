import type { Subject, Subscription } from 'rxjs';

export interface CollectionsBindMap {
}

export interface SingletonsBindMap {
}

export type KeyType = string | number | symbol;

export type CollectionBindKey = keyof CollectionsBindMap;
export type CollectionBindValue<K extends CollectionBindKey> = CollectionsBindMap[K];

export type SingletonBindKey = keyof SingletonsBindMap;
export type SingletonBindValue<K extends SingletonBindKey> = SingletonsBindMap[K];

export type PureCallback = () => void;
export type Consume<T> = (value: T) => void;
export type BiConsume<T0, T1> = (first: T0, second: T1) => void;
export type Getter<T> = () => T;
export type ValueOrGetter<T> = T | Getter<T>;
export type Compare<T> = (lhs: T, rhs: T) => boolean;
export type ComparePath<T, K extends keyof T> = (lhs: T, rhs: T, path: K) => boolean;

export enum BindingTypeEvent {
  DELETED,
  CREATED,
  UPDATED,
}

// BindBase will auto call Disposable.dispose when delete an item.
export interface Disposable {
  addDisposeDependency: (disposable: Subscription | undefined) => void;

  dispose (): void;
}

export type MutationEvent<T, K extends keyof T> = CreateEvent<K, T[K]> | DeleteEvent<K, T[K]> | UpdateEvent<K, T[K]>;

export type CreateEvent<K, V> = [tp: BindingTypeEvent.CREATED, key: K, currentValue: V]
export type DeleteEvent<K, V> = [tp: BindingTypeEvent.DELETED, key: K, currentValue: undefined, previousValue: V]
export type UpdateEvent<K, V> = [tp: BindingTypeEvent.UPDATED, key: K, currentValue: V, previousValue: V]

export type AnyReactive = {
  [REACTIVE_FLAG]: number
  [REACTIVE_PUBLISHER]: Subject<any>
}

export const REACTIVE_FLAG = Symbol('reactive#flag');
/**
 * @deprecated test only
 */
export const REACTIVE_PUBLISHER = Symbol('reactive#publisher');
export type REACTIVE_FLAG = typeof REACTIVE_FLAG;

export const REACTIVE_FLAG_MASK_TYPE = 0xff;
export const REACTIVE_FLAG_VALUE = 0x1;
export const REACTIVE_FLAG_OBJECT = 0x2;
export const REACTIVE_FLAG_ARRAY = 0x3;
export const REACTIVE_FLAG_MAP = 0x4;
export const REACTIVE_FLAG_SET = 0x5;
export const REACTIVE_FLAG_INACTIVE = 0x100;
export const REACTIVE_FLAG_SHALLOW = 0x200;

export {};
