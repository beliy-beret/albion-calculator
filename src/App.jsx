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
  Tooltip
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

// Данные о крафте дерева из гайда
const WOOD_DATA = {
  T2: { name: 'Birch (Береза)', logsPerPlank: 1, previousPlank: null },
  T3: { name: 'Chestnut (Каштан)', logsPerPlank: 2, previousPlank: 'T2' },
  T4: { name: 'Pine (Сосна)', logsPerPlank: 2, previousPlank: 'T3' },
  T5: { name: 'Cedar (Кедр)', logsPerPlank: 3, previousPlank: 'T4' },
  T6: { name: 'Bloodoak (Кровавый дуб)', logsPerPlank: 4, previousPlank: 'T5' },
  T7: { name: 'Ashenbark (Пепельная кора)', logsPerPlank: 5, previousPlank: 'T6' },
};

const WoodCraftingCalculator = () => {
  const [form] = Form.useForm();
  const [results, setResults] = useState(null);

  const calculateCrafting = (values) => {
    const {
      woodTier,
      logsAvailable,
      planksAvailable = 0,
      returnRate = 15.2,
      logPrice = 0,
      plankPrice = 0,
      craftingCost = 0
    } = values;

    const woodInfo = WOOD_DATA[woodTier];
    const returnRateDecimal = returnRate / 100;

    // Базовая стоимость создания одного бруска
    const logsNeededBase = woodInfo.logsPerPlank;
    const previousPlanksNeededBase = woodInfo.previousPlank ? 1 : 0;

    // С учетом возврата ресурсов
    const effectiveLogsNeeded = logsNeededBase * (1 - returnRateDecimal);
    const effectivePreviousPlanksNeeded = previousPlanksNeededBase * (1 - returnRateDecimal);

    // Максимальное количество брусков, которое можно создать
    let maxPlanksFromLogs = Math.floor(logsAvailable / effectiveLogsNeeded);
    
    // Если нужны бруски предыдущего тира
    if (woodInfo.previousPlank) {
      const maxPlanksFromPreviousTier = Math.floor(planksAvailable / effectivePreviousPlanksNeeded);
      maxPlanksFromLogs = Math.min(maxPlanksFromLogs, maxPlanksFromPreviousTier);
    }

    // Расчет остатков
    const logsUsed = maxPlanksFromLogs * effectiveLogsNeeded;
    const previousPlanksUsed = maxPlanksFromLogs * effectivePreviousPlanksNeeded;
    const logsRemaining = logsAvailable - logsUsed;
    const previousPlanksRemaining = planksAvailable - previousPlanksUsed;

    // Возврат ресурсов
    const logsReturned = maxPlanksFromLogs * logsNeededBase * returnRateDecimal;
    const previousPlanksReturned = maxPlanksFromLogs * previousPlanksNeededBase * returnRateDecimal;

    // Экономические расчеты
    const totalLogCost = Math.ceil(logsUsed) * logPrice;
    const totalPlankCost = Math.ceil(previousPlanksUsed) * plankPrice;
    const totalCraftingCost = craftingCost * maxPlanksFromLogs;
    const totalCost = totalLogCost + totalPlankCost + totalCraftingCost;
    const costPerUnit = maxPlanksFromLogs > 0 ? totalCost / maxPlanksFromLogs : 0;

    setResults({
      maxPlanks: maxPlanksFromLogs,
      logsUsed: Math.ceil(logsUsed),
      logsRemaining: Math.floor(logsRemaining),
      logsReturned: Math.floor(logsReturned),
      previousPlanksUsed: Math.ceil(previousPlanksUsed),
      previousPlanksRemaining: Math.floor(previousPlanksRemaining),
      previousPlanksReturned: Math.floor(previousPlanksReturned),
      efficiency: maxPlanksFromLogs > 0 ? ((maxPlanksFromLogs / (logsUsed + previousPlanksUsed)) * 100).toFixed(1) : 0,
      // Экономические показатели
      totalLogCost,
      totalPlankCost,
      totalCraftingCost,
      totalCost,
      costPerUnit,
      woodInfo
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Card 
        style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          🌲 Albion Online - Калькулятор крафта дерева
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Параметры крафта" size="small">
              <Form
                form={form}
                layout="vertical"
                onFinish={calculateCrafting}
                initialValues={{
                  woodTier: 'T4',
                  logsAvailable: 100,
                  planksAvailable: 50,
                  returnRate: 15.2,
                  logPrice: 50,
                  plankPrice: 150,
                  craftingCost: 10
                }}
              >
                <Form.Item
                  name="woodTier"
                  label="Тир дерева"
                  tooltip="Выберите уровень дерева для крафта"
                >
                  <Select>
                    {Object.entries(WOOD_DATA).map(([tier, data]) => (
                      <Option key={tier} value={tier}>
                        {tier} - {data.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="logsAvailable"
                  label="Количество бревен (логов)"
                  rules={[{ required: true, message: 'Введите количество бревен' }]}
                >
                  <InputNumber 
                    min={0} 
                    style={{ width: '100%' }}
                    placeholder="Например: 100"
                  />
                </Form.Item>

                <Form.Item
                  name="planksAvailable"
                  label="Количество брусьев предыдущего тира"
                  tooltip="Необходимо для крафта T3 и выше"
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
                  name="logPrice"
                  label="Цена бревна за единицу"
                  tooltip="Стоимость одного бревна (лога) на рынке"
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
                  name="plankPrice"
                  label="Цена бруска предыдущего тира"
                  tooltip="Стоимость одного бруска предыдущего тира на рынке"
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
                  tooltip="Стоимость крафта одного бруска (налоги, использование станка)"
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
                    message={`Можно создать: ${results.maxPlanks} брусьев ${results.woodInfo.name}`}
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
                        title="Создано брусьев"
                        value={results.maxPlanks}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Себестоимость единицы"
                        value={results.costPerUnit.toFixed(2)}
                        suffix="серебра"
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                  </Row>

                  <Divider orientation="left">Использовано ресурсов</Divider>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Бревна: </Text>
                      <Text>{results.logsUsed}</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Возврат: </Text>
                      <Text type="success">+{results.logsReturned}</Text>
                    </Col>
                  </Row>

                  {results.woodInfo.previousPlank && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text strong>Бруски пред. тира: </Text>
                        <Text>{results.previousPlanksUsed}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>Возврат: </Text>
                        <Text type="success">+{results.previousPlanksReturned}</Text>
                      </Col>
                    </Row>
                  )}

                  <Divider orientation="left">💰 Экономический расчет</Divider>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Стоимость бревен: </Text>
                      <Text>{results.totalLogCost.toFixed(0)} серебра</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Стоимость брусков: </Text>
                      <Text>{results.totalPlankCost.toFixed(0)} серебра</Text>
                    </Col>
                  </Row>

                  <Row gutter={16} style={{ marginTop: 8 }}>
                    <Col span={12}>
                      <Text strong>Стоимость крафта: </Text>
                      <Text>{results.totalCraftingCost.toFixed(0)} серебра</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Общая стоимость: </Text>
                      <Text type="warning">{results.totalCost.toFixed(0)} серебра</Text>
                    </Col>
                  </Row>

                  <Alert
                    style={{ marginTop: 16 }}
                    message={`Себестоимость одного бруска: ${results.costPerUnit.toFixed(2)} серебра`}
                    type="info"
                    showIcon
                  />

                  <Divider orientation="left">Остатки</Divider>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Бревна: </Text>
                      <Text>{results.logsRemaining}</Text>
                    </Col>
                    {results.woodInfo.previousPlank && (
                      <Col span={12}>
                        <Text strong>Бруски: </Text>
                        <Text>{results.previousPlanksRemaining}</Text>
                      </Col>
                    )}
                  </Row>
                </Space>
              </Card>
            )}

            <Card 
              title="Справочная информация" 
              size="small" 
              style={{ marginTop: 16 }}
            >
              <Space direction="vertical" size="small">
                <Text strong>Рецепты крафта:</Text>
                {Object.entries(WOOD_DATA).map(([tier, data]) => (
                  <Text key={tier} type="secondary">
                    {tier}: {data.logsPerPlank} бревна {data.previousPlank ? `+ 1 брусок ${data.previousPlank}` : ''}
                  </Text>
                ))}
                
                <Divider style={{ margin: '12px 0' }} />
                
                <Text strong>Экономические расчеты:</Text>
                <Text type="secondary">• Себестоимость = (Стоимость бревен + Стоимость брусков + Стоимость крафта) ÷ Количество брусьев</Text>
                <Text type="secondary">• Учитывается процент возврата ресурсов</Text>
                <Text type="secondary">• Стоимость крафта включает налоги станка</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default WoodCraftingCalculator;