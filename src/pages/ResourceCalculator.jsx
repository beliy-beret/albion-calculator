import React, { useState } from 'react';
import {
  Card,
  Form,
  InputNumber,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
  Divider,
  Space,
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

/** Одинаковые коэффициенты для дерева, руды, камня, волокна и шкуры */
const RESOURCE_TIER_DATA = {
  T2: { rawPerRefined: 1, previousTier: null },
  T3: { rawPerRefined: 2, previousTier: 'T2' },
  T4: { rawPerRefined: 2, previousTier: 'T3' },
  T5: { rawPerRefined: 3, previousTier: 'T4' },
  T6: { rawPerRefined: 4, previousTier: 'T5' },
  T7: { rawPerRefined: 5, previousTier: 'T6' },
};

const ResourceCraftingCalculator = () => {
  const [form] = Form.useForm();
  const [results, setResults] = useState(null);

  const calculateCrafting = (values) => {
    const {
      resourceTier,
      rawAvailable,
      previousRefinedAvailable = 0,
      returnRate = 15.2,
      rawPrice = 0,
      previousRefinedPrice = 0,
      craftingCost = 0,
    } = values;

    const tierInfo = RESOURCE_TIER_DATA[resourceTier];
    const returnRateDecimal = returnRate / 100;

    const rawNeededBase = tierInfo.rawPerRefined;
    const previousRefinedNeededBase = tierInfo.previousTier ? 1 : 0;

    const effectiveRawNeeded = rawNeededBase * (1 - returnRateDecimal);
    const effectivePreviousRefinedNeeded =
      previousRefinedNeededBase * (1 - returnRateDecimal);

    let maxRefinedFromRaw = Math.floor(rawAvailable / effectiveRawNeeded);

    if (tierInfo.previousTier) {
      const maxFromPrevious = Math.floor(
        previousRefinedAvailable / effectivePreviousRefinedNeeded
      );
      maxRefinedFromRaw = Math.min(maxRefinedFromRaw, maxFromPrevious);
    }

    const rawUsed = maxRefinedFromRaw * effectiveRawNeeded;
    const previousRefinedUsed =
      maxRefinedFromRaw * effectivePreviousRefinedNeeded;
    const rawRemaining = rawAvailable - rawUsed;
    const previousRefinedRemaining =
      previousRefinedAvailable - previousRefinedUsed;

    const rawReturned =
      maxRefinedFromRaw * rawNeededBase * returnRateDecimal;
    const previousRefinedReturned =
      maxRefinedFromRaw * previousRefinedNeededBase * returnRateDecimal;

    const totalRawCost = Math.ceil(rawUsed) * rawPrice;
    const totalPreviousRefinedCost =
      Math.ceil(previousRefinedUsed) * previousRefinedPrice;
    const totalCraftingCost = craftingCost * maxRefinedFromRaw;
    const totalCost =
      totalRawCost + totalPreviousRefinedCost + totalCraftingCost;
    const costPerUnit =
      maxRefinedFromRaw > 0 ? totalCost / maxRefinedFromRaw : 0;

    setResults({
      maxRefined: maxRefinedFromRaw,
      rawUsed: Math.ceil(rawUsed),
      rawRemaining: Math.floor(rawRemaining),
      rawReturned: Math.floor(rawReturned),
      previousRefinedUsed: Math.ceil(previousRefinedUsed),
      previousRefinedRemaining: Math.floor(previousRefinedRemaining),
      previousRefinedReturned: Math.floor(previousRefinedReturned),
      efficiency:
        maxRefinedFromRaw > 0
          ? (
              (maxRefinedFromRaw / (rawUsed + previousRefinedUsed)) *
              100
            ).toFixed(1)
          : 0,
      totalRawCost,
      totalPreviousRefinedCost,
      totalCraftingCost,
      totalCost,
      costPerUnit,
      tierInfo,
      resourceTier,
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Card
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          📦 Калькулятор переработки ресурсов
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Параметры крафта" size="small">
              <Form
                form={form}
                layout="vertical"
                onFinish={calculateCrafting}
                initialValues={{
                  resourceTier: 'T4',
                  rawAvailable: 100,
                  previousRefinedAvailable: 50,
                  returnRate: 15.2,
                  rawPrice: 50,
                  previousRefinedPrice: 150,
                  craftingCost: 10,
                }}
              >
                <Form.Item
                  name="resourceTier"
                  label="Тир ресурса"
                  tooltip="Одна схема для дерева, руды, камня, волокна и шкуры"
                >
                  <Select>
                    {Object.entries(RESOURCE_TIER_DATA).map(([tier, data]) => (
                      <Option key={tier} value={tier}>
                        {tier}
                        {data.previousTier
                          ? ` — ${data.rawPerRefined} сырья + 1× переработка ${data.previousTier}`
                          : ` — ${data.rawPerRefined} сырья`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="rawAvailable"
                  label="Необработанный ресурс (сырьё текущего тира)"
                  rules={[
                    { required: true, message: 'Введите количество сырья' },
                  ]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Например: 100"
                  />
                </Form.Item>

                <Form.Item
                  name="previousRefinedAvailable"
                  label="Переработанный ресурс предыдущего тира"
                  tooltip="Нужен для крафта с T3; для T2 не используется"
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Например: 50"
                  />
                </Form.Item>

                <Form.Item
                  name="returnRate"
                  label="Процент возврата ресурсов (%)"
                  tooltip="Базовый: 15.2%, с фокусом и бонусами может быть до 45%"
                >
                  <InputNumber
                    min={0}
                    max={50}
                    step={0.1}
                    style={{ width: '100%' }}
                    placeholder="15.2"
                  />
                </Form.Item>

                <Divider orientation="left" style={{ margin: '16px 0' }}>
                  <Text strong>💰 Экономические параметры</Text>
                </Divider>

                <Form.Item
                  name="rawPrice"
                  label="Цена единицы сырья"
                  tooltip="Стоимость одной единицы необработанного ресурса на рынке"
                >
                  <InputNumber
                    min={0}
                    step={1}
                    style={{ width: '100%' }}
                    placeholder="50"
                    addonAfter="серебра"
                  />
                </Form.Item>

                <Form.Item
                  name="previousRefinedPrice"
                  label="Цена переработки предыдущего тира"
                  tooltip="Стоимость одной единицы переработанного ресурса предыдущего тира"
                >
                  <InputNumber
                    min={0}
                    step={1}
                    style={{ width: '100%' }}
                    placeholder="150"
                    addonAfter="серебра"
                  />
                </Form.Item>

                <Form.Item
                  name="craftingCost"
                  label="Стоимость крафта за единицу"
                  tooltip="Стоимость одной единицы переработки (налоги, использование станка)"
                >
                  <InputNumber
                    min={0}
                    step={1}
                    style={{ width: '100%' }}
                    placeholder="10"
                    addonAfter="серебра"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ width: '100%' }}
                  >
                    Рассчитать
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            {results && (
              <Card title="Результаты расчета" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Alert
                    message={`Можно создать: ${results.maxRefined} ед. переработки ${results.resourceTier}`}
                    type="success"
                    showIcon
                  />

                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="Эффективность"
                        value={results.efficiency}
                        suffix="%"
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Получится переработки"
                        value={results.maxRefined}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Себестоимость"
                        value={results.costPerUnit.toFixed(2)}
                        suffix="серебра"
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                  </Row>

                  <Divider orientation="left">Использовано ресурсов</Divider>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Сырьё: </Text>
                      <Text>{results.rawUsed}</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Возврат: </Text>
                      <Text type="success">+{results.rawReturned}</Text>
                    </Col>
                  </Row>

                  {results.tierInfo.previousTier && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text strong>Переработка пред. тира: </Text>
                        <Text>{results.previousRefinedUsed}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>Возврат: </Text>
                        <Text type="success">
                          +{results.previousRefinedReturned}
                        </Text>
                      </Col>
                    </Row>
                  )}

                  <Divider orientation="left">💰 Экономический расчет</Divider>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Стоимость сырья: </Text>
                      <Text>{results.totalRawCost.toFixed(0)} серебра</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Стоимость переработки пред. тира: </Text>
                      <Text>
                        {results.totalPreviousRefinedCost.toFixed(0)} серебра
                      </Text>
                    </Col>
                  </Row>

                  <Row gutter={16} style={{ marginTop: 8 }}>
                    <Col span={12}>
                      <Text strong>Стоимость крафта: </Text>
                      <Text>{results.totalCraftingCost.toFixed(0)} серебра</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Общая стоимость: </Text>
                      <Text type="warning">
                        {results.totalCost.toFixed(0)} серебра
                      </Text>
                    </Col>
                  </Row>

                  <Alert
                    style={{ marginTop: 16 }}
                    message={`Себестоимость одной единицы переработки: ${results.costPerUnit.toFixed(2)} серебра`}
                    type="info"
                    showIcon
                  />

                  <Divider orientation="left">Остатки</Divider>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Сырьё: </Text>
                      <Text>{results.rawRemaining}</Text>
                    </Col>
                    {results.tierInfo.previousTier && (
                      <Col span={12}>
                        <Text strong>Переработка пред. тира: </Text>
                        <Text>{results.previousRefinedRemaining}</Text>
                      </Col>
                    )}
                  </Row>
                </Space>
              </Card>
            )}

            <Card
              title="Справочная информация"
              size="small"
              style={{ marginTop: results ? 16 : 0 }}
            >
              <Space direction="vertical" size="small">
                <Text strong>Рецепты (одинаковы для всех типов):</Text>
                <Text type="secondary">
                  Доски, слитки, каменные блоки, ткань, кожа — одни и те же
                  числа сырья и предыдущего тира.
                </Text>
                {Object.entries(RESOURCE_TIER_DATA).map(([tier, data]) => (
                  <Text key={tier} type="secondary">
                    {tier}: {data.rawPerRefined} сырья
                    {data.previousTier
                      ? ` + 1 переработка ${data.previousTier}`
                      : ''}
                  </Text>
                ))}

                <Divider style={{ margin: '12px 0' }} />

                <Text strong>Экономические расчеты:</Text>
                <Text type="secondary">
                  • Себестоимость = (Сырьё + переработка пред. тира + крафт) ÷
                  Количество единиц переработки
                </Text>
                <Text type="secondary">
                  • Учитывается процент возврата ресурсов
                </Text>
                <Text type="secondary">
                  • Стоимость крафта включает налоги станка
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ResourceCraftingCalculator;
