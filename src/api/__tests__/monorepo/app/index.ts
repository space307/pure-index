// @ts-nocheck
import { $list } from 'package-c';
import { reset, type Store } from 'package-a';

const $my: Store<string[]> = $list;
$my.reset(reset);
