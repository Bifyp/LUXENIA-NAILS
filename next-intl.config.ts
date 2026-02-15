import nextIntl from 'next-intl/plugin';

const withNextIntl = nextIntl('./next-intl.config.js');

export default withNextIntl({
  reactStrictMode: true
});
