import { defineComponent, PropType, toRefs, computed } from 'vue';
import {
  BrowseIcon as TdBrowseIcon,
  DeleteIcon as TdDeleteIcon,
  AddIcon as TdAddIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-vue-next';
import Loading from '../../loading';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from '../interface';
import { commonProps } from '../constants';
import { TdUploadProps, UploadFile } from '../type';

export interface ImageCardUploadProps extends CommonDisplayFileProps {
  multiple: TdUploadProps['multiple'];
  max: TdUploadProps['max'];
  disabled?: TdUploadProps['disabled'];
  showUploadProgress: TdUploadProps['showUploadProgress'];
  triggerUpload?: (e: MouseEvent) => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent; file: UploadFile }) => void;
  onPreview?: TdUploadProps['onPreview'];
}

export default defineComponent({
  name: 'UploadImageCard',

  props: {
    ...commonProps,
    multiple: Boolean,
    max: Number,
    disabled: Boolean,
    showUploadProgress: Boolean,
    triggerUpload: Function as PropType<ImageCardUploadProps['triggerUpload']>,
    uploadFiles: Function as PropType<ImageCardUploadProps['uploadFiles']>,
    cancelUpload: Function as PropType<ImageCardUploadProps['cancelUpload']>,
    onPreview: Function as PropType<ImageCardUploadProps['onPreview']>,
  },

  setup(props: ImageCardUploadProps) {
    const { displayFiles, locale, classPrefix, multiple, max } = toRefs(props);
    const { BrowseIcon, DeleteIcon, AddIcon, ErrorCircleFilledIcon } = useGlobalIcon({
      AddIcon: TdAddIcon,
      BrowseIcon: TdBrowseIcon,
      DeleteIcon: TdDeleteIcon,
      ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
    });

    const showTrigger = computed(() => {
      if (multiple.value) {
        return !max.value || displayFiles.value.length < max.value;
      }
      return !displayFiles.value?.[0];
    });

    const renderMainContent = (file: UploadFile, index: number) => {
      return (
        <div class={`${classPrefix.value}-upload__card-content ${classPrefix.value}-upload__card-box`}>
          <img class={`${classPrefix.value}-upload__card-image`} src={file.url} />
          <div class={`${classPrefix.value}-upload__card-mask`}>
            <span class={`${classPrefix.value}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
              <ImageViewer
                images={displayFiles.value.map((t: UploadFile) => t.url)}
                defaultIndex={index}
                trigger={(h, { open }) => {
                  return (
                    <BrowseIcon
                      onClick={({ e }: { e: MouseEvent }) => {
                        props.onPreview?.({ file, index, e });
                        open();
                      }}
                    />
                  );
                }}
              ></ImageViewer>
            </span>
            {!props.disabled && (
              <>
                <span class={`${classPrefix.value}-upload__card-mask-item-divider`} />
                <span class={`${classPrefix.value}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
                  <DeleteIcon onClick={({ e }: { e: MouseEvent }) => props?.onRemove?.({ e, file, index })} />
                </span>
              </>
            )}
          </div>
        </div>
      );
    };

    const renderProgressFile = (file: UploadFile, loadCard: string) => {
      return (
        <div class={loadCard}>
          <Loading loading={true} size="medium" />
          <p>
            {locale.value?.progress?.uploadingText}
            {props.showUploadProgress ? ` ${file.percent}%` : ''}
          </p>
        </div>
      );
    };

    const renderFailFile = (file: UploadFile, index: number, loadCard: string) => {
      return (
        <div class={loadCard}>
          <ErrorCircleFilledIcon />
          <p>{file.response?.error || locale.value?.progress?.failText}</p>
          <div class={`${classPrefix.value}-upload__card-mask`}>
            <span class={`${classPrefix.value}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
              <DeleteIcon onClick={({ e }: { e: MouseEvent }) => props?.onRemove?.({ e, file, index })} />
            </span>
          </div>
        </div>
      );
    };

    return () => {
      const cardItemClasses = `${classPrefix.value}-upload__card-item ${classPrefix.value}-is-background`;
      return (
        <div>
          <ul class={`${classPrefix.value}-upload__card`}>
            {displayFiles.value?.map((file: UploadFile, index: number) => {
              const loadCard = `${classPrefix.value}-upload__card-container ${classPrefix.value}-upload__card-box`;
              return (
                <li class={cardItemClasses} key={index}>
                  {file.status === 'progress' && renderProgressFile(file, loadCard)}
                  {file.status === 'fail' && renderFailFile(file, index, loadCard)}
                  {!['progress', 'fail'].includes(file.status) && file.url && renderMainContent(file, index)}
                  <div class={`${classPrefix.value}-upload__card-name`}>{file.name}</div>
                </li>
              );
            })}

            {showTrigger.value && (
              <li class={cardItemClasses} onClick={props.triggerUpload}>
                <div class={`${classPrefix.value}-upload__card-container ${classPrefix.value}-upload__card-box`}>
                  <AddIcon />
                  <p class={`${classPrefix.value}-size-s`}>{locale.value?.triggerUploadText?.image}</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      );
    };
  },
});
