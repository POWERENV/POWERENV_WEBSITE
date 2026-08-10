interface Window {
    switchSection: (page: string, e: Event | null) => Promise<unknown>;
    openSettings: () => void;
    performAction: (name: string) => void;
    performPower: (action: string) => void;
    addHardware: () => void;
}

declare const signalR: {
  HubConnectionBuilder: new () => {
    withUrl(url: string): {
      build(): {
        on(eventName: string, callback: (...args: any[]) => void): unknown;
        start(): Promise<unknown>;
      };
    };
  };
};

declare const config: {
  baseAPIURL: string;
};

declare class Chart<TType extends ChartType = ChartType, TData = DefaultDataPoint<TType>, TLabel = unknown> {
  readonly platform: BasePlatform;
  readonly id: string;
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly config: ChartConfiguration<TType, TData, TLabel> | ChartConfigurationCustomTypesPerDataset<TType, TData, TLabel>;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
  readonly boxes: LayoutItem[];
  readonly currentDevicePixelRatio: number;
  readonly chartArea: ChartArea;
  readonly scales: { [key: string]: Scale };
  readonly attached: boolean;

  readonly legend?: LegendElement<TType>; // Only available if legend plugin is registered and enabled
  readonly tooltip?: TooltipModel<TType>; // Only available if tooltip plugin is registered and enabled

  data: ChartData<TType, TData, TLabel>;
  options: ChartOptions<TType>;

  constructor(item: ChartItem, config: ChartConfiguration<TType, TData, TLabel> | ChartConfigurationCustomTypesPerDataset<TType, TData, TLabel>);

  clear(): this;
  stop(): this;

  resize(width?: number, height?: number): void;
  ensureScalesHaveIDs(): void;
  buildOrUpdateScales(): void;
  buildOrUpdateControllers(): void;
  reset(): void;
  update(mode?: UpdateMode | ((ctx: { datasetIndex: number }) => UpdateMode)): void;
  render(): void;
  draw(): void;

  isPointInArea(point: Point): boolean;
  getElementsAtEventForMode(e: Event, mode: string, options: InteractionOptions, useFinalPosition: boolean): InteractionItem[];

  getSortedVisibleDatasetMetas(): ChartMeta[];
  getDatasetMeta(datasetIndex: number): ChartMeta;
  getVisibleDatasetCount(): number;
  isDatasetVisible(datasetIndex: number): boolean;
  setDatasetVisibility(datasetIndex: number, visible: boolean): void;
  toggleDataVisibility(index: number): void;
  getDataVisibility(index: number): boolean;
  hide(datasetIndex: number, dataIndex?: number): void;
  show(datasetIndex: number, dataIndex?: number): void;

  getActiveElements(): ActiveElement[];
  setActiveElements(active: ActiveDataPoint[]): void;

  destroy(): void;
  toBase64Image(type?: string, quality?: unknown): string;
  bindEvents(): void;
  unbindEvents(): void;
  updateHoverStyle(items: InteractionItem[], mode: 'dataset', enabled: boolean): void;

  notifyPlugins(hook: string, args?: AnyObject): boolean | void;

  isPluginEnabled(pluginId: string): boolean;

  getContext(): { chart: Chart, type: string };

  static readonly defaults: Defaults;
  static readonly overrides: Overrides;
  static readonly version: string;
  static readonly instances: { [key: string]: Chart };
  static readonly registry: Registry;
  static getChart(key: string | CanvasRenderingContext2D | HTMLCanvasElement): Chart | undefined;
  static register(...items: ChartComponentLike[]): void;
  static unregister(...items: ChartComponentLike[]): void;
}