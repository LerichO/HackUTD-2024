// typings.d.ts
declare module 'react-native-draggable-flatlist' {
    import { FlatListProps, ListRenderItemInfo } from 'react-native';
  
    export interface RenderItemParams<T> extends ListRenderItemInfo<T> {
      drag: () => void;
      isActive: boolean;
    }
  
    export interface DraggableFlatListProps<T> extends FlatListProps<T> {
      onDragEnd?: (data: { data: T[] }) => void;
      data: T[];
      renderItem: (info: RenderItemParams<T>) => React.ReactNode;
    }
  
    const DraggableFlatList: <T>(props: DraggableFlatListProps<T>) => JSX.Element;
    export default DraggableFlatList;
  }
  