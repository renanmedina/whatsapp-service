'use strict';

const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } = require('@opentelemetry/semantic-conventions');
const { OTEL_EXPORTER_OTLP_ENDPOINT, SERVICE_NAME, SERVICE_VERSION, OTEL_EXPORTER_SAMPING_PERCENTAGE } = require('./config');
const ApplicationLogger = require('./logger');

const exporterOptions = {
  url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`
}

console.log(exporterOptions);

const openTelemetryTraceExporter = new OTLPTraceExporter(exporterOptions);
const TelemetrySdk = new opentelemetry.NodeSDK({
  traceExporter: openTelemetryTraceExporter,
  // metricReader: new PeriodicExportingMetricReader({
  //   exporter: new ConsoleMetricExporter(),
  // }),
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [ATTR_SERVICE_NAME]: SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: SERVICE_VERSION
  }),
});
  
// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
TelemetrySdk.start();
  
// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  TelemetrySdk.shutdown()
  .then(() => ApplicationLogger.info('Tracing terminated'))
  .catch((error) => ApplicationLogger.error('Error terminating tracing', error))
  .finally(() => process.exit(0));
});

module.exports = { TelemetrySdk }