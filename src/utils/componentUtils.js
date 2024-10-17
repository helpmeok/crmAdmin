import useDictStore from '@/store/modules/dict'
import { useDict } from '@/utils/dict'
import { setDictValNum } from '@/utils/ruoyi'
export function setDataOptions(item) {
  let res;
  if (item.dictType) {
    const dictType = item.dictType;
    if (!useDictStore().finishDicts.includes(dictType)) {
      const options = useDict(dictType)[dictType];
      const isSetDictValNum = item.isSetDictValNum;
      useDictStore().setfinishDicts(dictType);
      res = isSetDictValNum ? setDictValNum(options.value) : options.value;
    } else {
      res = useDictStore().getDict(dictType);
    }
  } else {
    res = item?.options;
  }
  return res;
}